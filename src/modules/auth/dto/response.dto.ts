import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/response.dto';
import { IAuthResponse } from 'src/common/interfaces/response.interface';

export class UserPayloadDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;
}

export class AuthResponseDto implements IAuthResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserPayloadDto })
  user: UserPayloadDto;
}

export class AuthResponseWrapperDto extends BaseResponseDto {
  @ApiProperty({ type: AuthResponseDto })
  data: AuthResponseDto;
}
