import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { calculateQuantityToBuy, daysBudget } from "./util.js";
//10 days remaining

describe('Test daysBudget', () => {
  beforeEach(() => {
    Date.now = jest.fn(() => new Date("2025-05-17T12:33:37.000Z"));
    // Date.now = jest.fn(() => new Date("2025-04-30T15:15:37.000Z"));

  });

  it('should be 100 with 0 days didnt buy and 10 remaining', () => {
    expect(daysBudget(1000, 0)).toBe(100);
  });

  it('should be 200 with 1 days didnt buy and 10 remaining', () => {
    expect(daysBudget(1100, 1)).toBe(200);
  })

  it('should be 1600 with 15 days didnt buy and 10 remaining', () => {
    expect(daysBudget(2500, 15)).toBe(1600);
  })

  it('should be 1600 with 15 days didnt buy and 10 remaining', () => {
    expect(daysBudget(2500, 15)).toBe(1600);
  });

  it('should be entire budget because last day of the month', () => {
    Date.now = jest.fn(() => new Date("2025-04-30T12:33:37.000Z"));
    expect(daysBudget(1000, 0)).toBe(1000);
  });
})

describe('Test calculateQuantityToBuy', () => {
  beforeEach(() => {
    Date.now = jest.fn(() => new Date("2025-05-17T12:33:37.000Z"));
  })

  it('should be 1 with 0 days didnt buy and 10 days remaining', () => {
    expect(calculateQuantityToBuy(100, 2000, 0)).toBe(2);
  });

  it('should be 4 with 1 days didnt buy and 10 days remaining', () => {
    const lastDaysDidntBuy = 1;
    expect(calculateQuantityToBuy(100, 2200, lastDaysDidntBuy)).toBe(2*(lastDaysDidntBuy+1));
  });

  it('should be 9 with 0 days didnt buy and 10 days remaining', () => {
    //because full fund is less than stocks if we buy everyday
    const lastDaysDidntBuy = 0;
    expect(calculateQuantityToBuy(100, 900, lastDaysDidntBuy)).toBe(9*(lastDaysDidntBuy+1));
  });

  it('should be 5 with 0 days didnt buy and 10 days remaining', () => {
    //because full fund is less than stocks if we buy everyday
    // but max fund config is 1000
    const lastDaysDidntBuy = 0;
    expect(calculateQuantityToBuy(200, 1200, lastDaysDidntBuy)).toBe(5*(lastDaysDidntBuy+1));
  });
});