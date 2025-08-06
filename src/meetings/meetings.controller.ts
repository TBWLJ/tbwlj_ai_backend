// src/meetings/meetings.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {
    constructor(private readonly meetingsService: MeetingsService) {}

    @Post()
    create(@Body() body: any) {
        return this.meetingsService.create(body);
    }

    @Get()
    findAll() {
        return this.meetingsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.meetingsService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updates: any) {
        return this.meetingsService.update(id, updates);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.meetingsService.delete(id);
    }

}
