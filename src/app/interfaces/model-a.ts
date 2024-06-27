import { ModelBase } from './model-base';

export interface ModelA extends ModelBase {
    parentIds: number[];
    chiledIds: number[];
}