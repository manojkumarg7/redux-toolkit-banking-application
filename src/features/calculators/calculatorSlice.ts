import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type {
  CompoundInterestResult,
  CompoundingFrequency,
  EmiResult,
  FdResult,
  RdResult,
  SimpleInterestResult,
  TenureUnit,
} from '../../types';
import {
  calculateCompoundInterest,
  calculateEmi,
  calculateFixedDeposit,
  calculateRecurringDeposit,
  calculateSimpleInterest,
} from '../../utils/calculators';

interface CalculatorState {
  simple: {
    principal: number;
    rate: number;
    time: number;
    result: SimpleInterestResult;
  };
  compound: {
    principal: number;
    rate: number;
    time: number;
    frequency: CompoundingFrequency;
    result: CompoundInterestResult;
  };
  emi: {
    principal: number;
    rate: number;
    tenure: number;
    unit: TenureUnit;
    result: EmiResult;
  };
  fd: {
    deposit: number;
    rate: number;
    tenure: number;
    frequency: CompoundingFrequency;
    result: FdResult;
  };
  rd: {
    monthlyDeposit: number;
    rate: number;
    tenureMonths: number;
    result: RdResult;
  };
}

const initialState: CalculatorState = {
  simple: {
    principal: 100000,
    rate: 6.5,
    time: 2,
    result: calculateSimpleInterest(100000, 6.5, 2),
  },
  compound: {
    principal: 100000,
    rate: 7,
    time: 3,
    frequency: 'quarterly',
    result: calculateCompoundInterest(100000, 7, 3, 'quarterly'),
  },
  emi: {
    principal: 500000,
    rate: 8.5,
    tenure: 5,
    unit: 'years',
    result: calculateEmi(500000, 8.5, 5, 'years'),
  },
  fd: {
    deposit: 100000,
    rate: 7.1,
    tenure: 3,
    frequency: 'quarterly',
    result: calculateFixedDeposit(100000, 7.1, 3, 'quarterly'),
  },
  rd: {
    monthlyDeposit: 5000,
    rate: 6.5,
    tenureMonths: 24,
    result: calculateRecurringDeposit(5000, 6.5, 24),
  },
};

const calculatorSlice = createSlice({
  name: 'calculators',
  initialState,
  reducers: {
    setSimpleInputs(
      state,
      action: PayloadAction<Partial<Pick<CalculatorState['simple'], 'principal' | 'rate' | 'time'>>>,
    ) {
      state.simple = { ...state.simple, ...action.payload };
      state.simple.result = calculateSimpleInterest(
        state.simple.principal,
        state.simple.rate,
        state.simple.time,
      );
    },
    setCompoundInputs(
      state,
      action: PayloadAction<
        Partial<Pick<CalculatorState['compound'], 'principal' | 'rate' | 'time' | 'frequency'>>
      >,
    ) {
      state.compound = { ...state.compound, ...action.payload };
      state.compound.result = calculateCompoundInterest(
        state.compound.principal,
        state.compound.rate,
        state.compound.time,
        state.compound.frequency,
      );
    },
    setEmiInputs(
      state,
      action: PayloadAction<
        Partial<Pick<CalculatorState['emi'], 'principal' | 'rate' | 'tenure' | 'unit'>>
      >,
    ) {
      state.emi = { ...state.emi, ...action.payload };
      state.emi.result = calculateEmi(
        state.emi.principal,
        state.emi.rate,
        state.emi.tenure,
        state.emi.unit,
      );
    },
    setFdInputs(
      state,
      action: PayloadAction<
        Partial<Pick<CalculatorState['fd'], 'deposit' | 'rate' | 'tenure' | 'frequency'>>
      >,
    ) {
      state.fd = { ...state.fd, ...action.payload };
      state.fd.result = calculateFixedDeposit(
        state.fd.deposit,
        state.fd.rate,
        state.fd.tenure,
        state.fd.frequency,
      );
    },
    setRdInputs(
      state,
      action: PayloadAction<
        Partial<Pick<CalculatorState['rd'], 'monthlyDeposit' | 'rate' | 'tenureMonths'>>
      >,
    ) {
      state.rd = { ...state.rd, ...action.payload };
      state.rd.result = calculateRecurringDeposit(
        state.rd.monthlyDeposit,
        state.rd.rate,
        state.rd.tenureMonths,
      );
    },
  },
});

export const { setSimpleInputs, setCompoundInputs, setEmiInputs, setFdInputs, setRdInputs } =
  calculatorSlice.actions;

export const selectSimpleCalculator = (state: RootState) => state.calculators.simple;
export const selectCompoundCalculator = (state: RootState) => state.calculators.compound;
export const selectEmiCalculator = (state: RootState) => state.calculators.emi;
export const selectFdCalculator = (state: RootState) => state.calculators.fd;
export const selectRdCalculator = (state: RootState) => state.calculators.rd;

export default calculatorSlice.reducer;
