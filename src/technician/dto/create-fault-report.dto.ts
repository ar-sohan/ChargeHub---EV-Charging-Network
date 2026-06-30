export class CreateFaultReportDto {
  stationId: string;
  technicianName: string;
  faultType: string;
  description: string;
  severity: string;
}

export class UpdateFaultStatusDto {
  status: string;
  resolutionNote: string;
}
