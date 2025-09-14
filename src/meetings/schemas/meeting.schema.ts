import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MeetingDocument = Meeting & Document;

@Schema()
export class Meeting {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  meetLink: string;

  @Prop()
  agenda?: string;

  @Prop({ required: true })
  scheduledTime: Date;

  @Prop({ default: false })
  botStarted: boolean;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
