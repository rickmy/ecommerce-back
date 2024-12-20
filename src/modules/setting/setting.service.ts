import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SettingEntity } from './entities/setting.entity';

@Injectable()
export class SettingService {
  constructor(private _prismaService: PrismaService) {}

  async create(createSettingDto: CreateSettingDto): Promise<SettingEntity> {
    try {
      const response = await this._prismaService.setting.create({
        data: createSettingDto,
      });
      if (!response)
        throw new HttpException('Setting not created', HttpStatus.BAD_REQUEST);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  findAll() {
    return `This action returns all setting`;
  }

  findByName(name: string) {
    try {
      const setting = this._prismaService.setting.findFirst({
        where: {
          name,
        },
      });
      if (!setting)
        throw new HttpException('Setting not found', HttpStatus.NOT_FOUND);
      return setting;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: number, updateSettingDto: UpdateSettingDto) {
    try {
      const isExist = await this._prismaService.setting.findFirst({
        where: {
          id,
        },
      });
      if (!isExist)
        throw new HttpException('Setting not found', HttpStatus.NOT_FOUND);
      const response = await this._prismaService.setting.update({
        where: {
          id,
        },
        data: updateSettingDto,
      });
      if (!response)
        throw new HttpException('Setting not updated', HttpStatus.BAD_REQUEST);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  remove(id: number) {
    try {
      this._prismaService.setting.update({
        where: {
          id,
        },
        data: {
          status: false,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
