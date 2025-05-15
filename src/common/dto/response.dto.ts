import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({
    description: 'Indicates whether the request was successful or not',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'A message describing the result of the request',
    example: 'Request successful',
  })
  message: string;

  @ApiProperty({
    description: 'An array of error objects',
    isArray: true,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        field: {
          type: 'string',
          description: 'The field that caused the error',
          example: 'email',
        },
        message: {
          type: 'string',
          description: 'The error message',
          example: 'Email is required',
        },
      },
    },
    required: false,
  })
  errors?: any[];
}
