import { Document, Model, FilterQuery, UpdateQuery } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseCrudService<T extends Document> {
  constructor(protected readonly model: Model<T>) { }

  async create(createDto: any): Promise<T> {
    const entity = new this.model(createDto);
    return entity.save();
  }

  async findAll(filter: FilterQuery<T> = {}, projection?: any): Promise<T[]> {
    return this.model.find(filter, projection).exec();
  }

  async findById(id: string): Promise<T> {
    const entity = await this.model.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async update(id: string, updateDto: UpdateQuery<T>): Promise<T> {
    const updated = await this.model.findByIdAndUpdate(
      id,
      { $set: updateDto },
      { new: true }
    );
    if (!updated) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<T> {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return deleted;
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }
}