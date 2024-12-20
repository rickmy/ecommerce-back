import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingEntity } from './entities/setting.entity';

@ApiTags('setting')
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  @ApiOperation({ summary: 'Create setting' })
  @ApiOkResponse({ description: 'Setting created', type: SettingEntity })
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingService.create(createSettingDto);
  }

  @Get()
  findAll() {
    return this.settingService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.settingService.findByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.update(+id, updateSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingService.remove(+id);
  }
}
