import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Meeting, MeetingDocument } from './schemas/meeting.schema';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
  ) {}

  async create(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    const meeting = new this.meetingModel(createMeetingDto);
    return meeting.save();
  }

  async findAll(): Promise<Meeting[]> {
    return this.meetingModel.find().exec();
  }

  async findOne(id: string): Promise<Meeting | null> {
    return this.meetingModel.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateMeetingDto): Promise<Meeting | null> {
    return this.meetingModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Meeting | null> {
    return this.meetingModel.findByIdAndDelete(id).exec();
  }
}
