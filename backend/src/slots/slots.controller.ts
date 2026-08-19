import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { SlotsService } from './slots.service';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  create(@Body() createSlotDto: CreateSlotDto) {
    return this.slotsService.create(createSlotDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSlotDto: UpdateSlotDto) {
    return this.slotsService.update(Number(id), updateSlotDto);
  }

  @Get()
  findAll() {
    return this.slotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slotsService.findOne(Number(id));
  }
}
