import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { VehicleType } from '../../common/enums/vehicle-type.enums';

export class CreateVehicleEntryDto {
  @IsString()
  @IsNotEmpty()
  vehicleNumber!: string;

  @IsEnum(VehicleType)
  vehicleType!: VehicleType;

  @IsInt()
  slotId!: number;
}
