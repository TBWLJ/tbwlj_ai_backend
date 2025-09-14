// meetings.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from './schemas/meeting.schema';
import { CreateMeetingDto } from './dto/create-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name)
    private meetingModel: Model<MeetingDocument>,
  ) {}

  async create(createMeetingDto: CreateMeetingDto): Promise<MeetingDocument> {
    const meeting = new this.meetingModel(createMeetingDto);
    return meeting.save();
  }

  async findUpcoming(): Promise<MeetingDocument[]> {
    return this.meetingModel.find({ scheduledTime: { $gte: new Date() } });
  }

  async findAll(): Promise<MeetingDocument[]> {
    return this.meetingModel.find();
  }

  async markBotStarted(id: string): Promise<void> {
    await this.meetingModel.findByIdAndUpdate(id, { botStarted: true });
  }
}
