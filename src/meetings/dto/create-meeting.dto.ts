export class CreateMeetingDto {
  title: string;
  meetLink: string;
  scheduledTime: Date;
  agenda?: string;
}
