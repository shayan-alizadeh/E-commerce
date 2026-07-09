import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class FactorListener {
  @OnEvent('factor-create')
  handlerFactorCreate(order: any) {
    console.log('Create Factor for this order :', order);
  }
}
