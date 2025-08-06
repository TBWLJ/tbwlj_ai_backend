// src/meetings/meetings.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from './meetings.schema';

@Injectable()
export class MeetingsService {
    constructor(
        @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
    ) {}

    async create(data: Partial<Meeting>): Promise<Meeting> {
        const meeting = new this.meetingModel(data);
        return meeting.save();
    }

    async findAll(): Promise<Meeting[]> {
        return this.meetingModel.find().exec();
    }

    async findById(id: string): Promise<Meeting> {
        return this.meetingModel.findById(id).exec();
    }

    async update(id: string, updates: Partial<Meeting>) {
        return this.meetingModel.findByIdAndUpdate(id, updates, { new: true });
    }

    async delete(id: string): Promise<Meeting> {
        return this.meetingModel.findByIdAndDelete(id).exec();
    }
}
