import {applyDecorators, UsePipes, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiBody} from '@nestjs/swagger';

export function ApiPost(route: string, requestModel?: any, responseModel?: any) {
    return applyDecorators(
        ApiOperation({summary: 'Create a new resource'}),
        ApiResponse({status: 201, description: 'The resource has been successfully created'}),
        ApiResponse({status: 400, description: 'Bad Request'}),
        ApiBody({type: requestModel}), // Eğer request model tanımlanmışsa, bu modeli kullan
        ApiBody({type: responseModel}), // Eğer response model tanımlanmışsa, bu modeli kullan
    );
}

export function ApiPut(route: string, requestModel?: any, responseModel?: any) {
    return applyDecorators(
        ApiOperation({summary: 'Update an existing resource'}),
        ApiResponse({status: 200, description: 'The resource has been successfully updated'}),
        ApiResponse({status: 400, description: 'Bad Request'}),
        ApiResponse({status: 404, description: 'Resource not found'}),
        ApiBody({type: requestModel}), // Eğer request model tanımlanmışsa, bu modeli kullan
        ApiBody({type: responseModel}), // Eğer response model tanımlanmışsa, bu modeli kullan
    );
}

export function ApiGet(route: string, responseModel?: any) {
    return applyDecorators(
        ApiOperation({summary: 'Get a resource'}),
        ApiResponse({status: 200, description: 'The resource has been successfully retrieved'}),
        ApiResponse({status: 404, description: 'Resource not found'}),
        ApiResponse({status: 500, description: 'Internal Server Error'}),
        ApiBody({type: responseModel}), // Eğer response model tanımlanmışsa, bu modeli kullan
    );
}

export function ApiDelete(route: string) {
    return applyDecorators(
        ApiOperation({summary: 'Delete a resource'}),
        ApiResponse({status: 200, description: 'The resource has been successfully deleted'}),
        ApiResponse({status: 404, description: 'Resource not found'}),
        ApiResponse({status: 500, description: 'Internal Server Error'}),
    );
}

