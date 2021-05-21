/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Activity, AttachmentData, ConversationParameters, StatusCodes, Transcript } from 'botbuilder-core';
import { ChannelServiceHandlerBase } from './channelServiceHandlerBase';
import { RouteConstants } from './routeConstants';
import { StatusCodeError } from './statusCodeError';
import { WebRequest, WebResponse } from './interfaces';
import { validateAndFixActivity } from './activityValidator';

function readBody<T>(req: WebRequest): Promise<T> {
    return new Promise((resolve, reject) => {
        if (req.body) {
            try {
                resolve(req.body);
            } catch (err) {
                reject(new StatusCodeError(StatusCodes.BAD_REQUEST, err.message));
            }
        } else {
            let requestData = '';

            req.on('data', (chunk: string) => (requestData += chunk));

            req.on('error', (err: Error | string) =>
                reject(new StatusCodeError(StatusCodes.BAD_REQUEST, err instanceof Error ? err.message : err))
            );

            req.on('end', () => {
                try {
                    resolve(JSON.parse(requestData));
                } catch (err) {
                    reject(new StatusCodeError(StatusCodes.BAD_REQUEST, err.message));
                }
            });
        }
    });
}

const readActivity = async (req: WebRequest): Promise<Activity> => {
    try {
        return validateAndFixActivity(await readBody<Activity>(req));
    } catch (err) {
        throw new StatusCodeError(StatusCodes.BAD_REQUEST, err.message);
    }
};

function handler(
    fn: (req: WebRequest, authHeader: string, res: WebResponse) => Promise<[StatusCodes, unknown?]>
): (req: WebRequest, res: WebResponse) => Promise<void> {
    return async (req, res) => {
        try {
            const [statusCode, body] = await fn(req, req.headers.authorization ?? req.headers.Authorization ?? '', res);

            if (body) {
                res.send(body);
            }

            res.status(statusCode);
        } catch (err) {
            if (err instanceof StatusCodeError) {
                res.send(err.message);
                res.status(err.statusCode);
            } else {
                res.status(500);
            }
        } finally {
            res.end();
        }
    };
}

/**
 * Signature for generic HTTP route handler
 */
export type RouteHandler = (request: WebRequest, response: WebResponse) => void;

/**
 * Interface representing an Express Application or a Restify Server.
 */
export interface WebServer {
    get: (path: string, handler: RouteHandler) => void;
    post: (path: string, handler: RouteHandler) => void;
    put: (path: string, handler: RouteHandler) => void;
    // For the DELETE HTTP Method, we need two optional methods:
    //  - Express 4.x has delete() - https://expressjs.com/en/4x/api.html#app.delete.method
    //  - restify has del() - http://restify.com/docs/server-api/#del
    del?: (path: string, handler: RouteHandler) => void;
    delete?: (path: string, handler: RouteHandler) => void;
}

/**
 * Routes the API calls with the ChannelServiceHandler methods.
 */
export class ChannelServiceRoutes {
    constructor(private readonly channelServiceHandler: ChannelServiceHandlerBase) {}

    /**
     * Registers all Channel Service paths on the provided WebServer.
     *
     * @param server WebServer
     * @param basePath Optional basePath which is appended before the service's REST API is configured on the WebServer.
     */
    public register(server: WebServer, basePath = ''): void {
        server.post(
            `${basePath}${RouteConstants.Activities}`,
            handler(async (req, authHeader) => [
                StatusCodes.OK,
                await this.channelServiceHandler.handleSendToConversation(
                    authHeader,
                    req.params.conversationId,
                    await readActivity(req)
                ),
            ])
        );

        server.post(
            `${basePath}${RouteConstants.Activity}`,
            handler(async (req, authHeader) => [
                StatusCodes.OK,
                await this.channelServiceHandler.handleReplyToActivity(
                    authHeader,
                    req.params.conversationId,
                    req.params.activityId,
                    await readActivity(req)
                ),
            ])
        );

        server.put(
            `${basePath}${RouteConstants.Activity}`,
            handler(async (req, authHeader) => [
                StatusCodes.OK,
                await this.channelServiceHandler.handleUpdateActivity(
                    authHeader,
                    req.params.conversationId,
                    req.params.activityId,
                    await readActivity(req)
                ),
            ])
        );

        server.get(
            `${basePath}${RouteConstants.ActivityMembers}`,
            handler(async (req, authHeader) => [
                StatusCodes.OK,
                await this.channelServiceHandler.handleGetActivityMembers(
                    authHeader,
                    req.params.conversationId,
                    req.params.activityId
                ),
            ])
        );

        server.post(
            `${basePath}${RouteConstants.Conversations}`,
            handler(async (req, authHeader) => [
                StatusCodes.CREATED,
                await this.channelServiceHandler.handleCreateConversation(
                    authHeader,
                    await readBody<ConversationParameters>(req)
                ),
            ])
        );

        server.get(
            `${basePath}${RouteConstants.Conversations}`,
            handler(async (req, authHeader) => [
                StatusCodes.OK,
                await this.channelServiceHandler.handleGetConversations(
                    authHeader,
                    req.params.conversationId,
                    req.query.continuationToken
                ),
            ])
        );

        server.get(
            `${basePath}${RouteConstants.ConversationMembers}`,
            handler(async (req, authHeader) => [
                StatusCodes.OK,
                await this.channelServiceHandler.handleGetConversationMembers(authHeader, req.params.conversationId),
            ])
        );

        server.get(
            `${basePath}${RouteConstants.ConversationPagedMembers}`,
            handler(async (req, authHeader) => {
                let pageSize = parseInt(req.query.pageSize, 10);
                if (isNaN(pageSize)) {
                    pageSize = undefined;
                }

                return [
                    StatusCodes.OK,
                    await this.channelServiceHandler.handleGetConversationPagedMembers(
                        authHeader,
                        req.params.conversationId,
                        pageSize,
                        req.query.continuationToken
                    ),
                ];
            })
        );

        server.post(
            `${basePath}${RouteConstants.ConversationHistory}`,
            handler(async (req, authHeader) => [
                StatusCodes.OK,
                await this.channelServiceHandler.handleSendConversationHistory(
                    authHeader,
                    req.params.conversationId,
                    await readBody<Transcript>(req)
                ),
            ])
        );

        server.post(
            `${basePath}${RouteConstants.Attachments}`,
            handler(async (req, authHeader) => [
                StatusCodes.OK,
                await this.channelServiceHandler.handleUploadAttachment(
                    authHeader,
                    req.params.conversationId,
                    await readBody<AttachmentData>(req)
                ),
            ])
        );

        const deleteConversationMember = handler(async (req, authHeader) => {
            await this.channelServiceHandler.handleDeleteConversationMember(
                authHeader,
                req.params.conversationId,
                req.params.memberId
            );

            return [StatusCodes.OK];
        });

        const deleteActivity = handler(async (req, authHeader) => {
            await this.channelServiceHandler.handleDeleteActivity(
                authHeader,
                req.params.conversationId,
                req.params.activityId
            );

            return [StatusCodes.OK];
        });

        // Express 4.x uses the delete() method to register handlers for the DELETE method.
        // Restify 8.x uses the del() method.
        if (typeof server.delete === 'function') {
            server.delete(`${basePath}${RouteConstants.ConversationMember}`, deleteConversationMember);
            server.delete(`${basePath}${RouteConstants.Activity}`, deleteActivity);
        } else if (typeof server.del === 'function') {
            server.del(`${basePath}${RouteConstants.ConversationMember}`, deleteConversationMember);
            server.del(`${basePath}${RouteConstants.Activity}`, deleteActivity);
        }
    }
}
