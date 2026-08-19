import { Body, Controller, Post } from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { SlotsService } from './slots.service';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  create(@Body() createSlotDto: CreateSlotDto) {
    return this.slotsService.create(createSlotDto);
  }
}
