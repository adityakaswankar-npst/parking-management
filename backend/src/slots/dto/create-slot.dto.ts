import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VehicleType } from '../../common/enums/vehicle-type.enums';

export class CreateSlotsDto {
  @IsString()
  @IsNotEmpty()
  slotNumber!: string;

  @IsEnum(VehicleType)
  vehicleType!: VehicleType;
}
