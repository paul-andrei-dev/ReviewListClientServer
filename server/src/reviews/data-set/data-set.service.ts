import { Injectable } from '@nestjs/common';
import { ITop3Reviews } from '../../@types';

@Injectable()
export class DataSetService {
  private readonly possibleValues: Array<Array<string>>;

  constructor() {
    this.possibleValues = [
      ['Mr', 'Ms'],
      ['Santa', 'Claus', 'Terminator', 'Caramba'],
      ['Santa', 'Claus', 'Terminator', 'Caramba'],
      [
        'My review says this is amazing',
        'My review says this is ok',
        'My review says this is MEH',
      ],
      ['PST', 'EDT', 'UTC'],
    ];
  }

  gen(idx: number, changingValue: number): string {
    return this.possibleValues[idx][
      changingValue % this.possibleValues[idx].length
    ];
  }

  top3(inputDate?: number): ITop3Reviews {
    const changingValue = Math.floor((inputDate || Date.now()) / 30000);
    return {
      top3Reviews: [
        {
          name: `${this.gen(0, changingValue)} ${this.gen(1, changingValue)} ${this.gen(2, changingValue * 7)}`,
          body: `${this.gen(3, changingValue)}`,
          date: changingValue * 30000,
          timezone: this.gen(4, changingValue),
          rating: Math.floor(Math.random() * 6),
        },
        {
          name: `${this.gen(0, changingValue * 5)} ${this.gen(1, changingValue * 5)} ${this.gen(2, changingValue * 5 * 7)}`,
          body: `${this.gen(3, changingValue * 5)}`,
          date: changingValue * 30000 + 120000,
          timezone: this.gen(4, changingValue * 5),
          rating: Math.floor(Math.random() * 6),
        },
        {
          name: `${this.gen(0, changingValue * 3)} ${this.gen(1, changingValue * 3)} ${this.gen(2, changingValue * 3 * 7)}`,
          body: `${this.gen(3, changingValue * 3)}`,
          date: changingValue * 30000 + 60000,
          timezone: this.gen(4, changingValue * 3),
          rating: Math.floor(Math.random() * 6),
        },
      ],
    };
  }
}
