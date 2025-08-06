import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MeetingDocument = Meeting & Document;

@Schema()

export class Meeting {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    meetingUrl: string;

    @Prop()
    startTime: Date;

    @Prop()
    transcript: string;

    @Prop()
    summary: string;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);