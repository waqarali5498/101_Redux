import { createSlice } from "@reduxjs/toolkit";

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

//Using RDT we can write mutating logic in reducer instead of returning state

const accountSlice = createSlice({
  name: "account",
  initialState: initialStateAccount,
  reducers: {
    deposit(state, action) {
      state.balance = state.balance + action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance = state.balance - action.payload;
    }, //Limitation is that it can only accepts one parameter
    //but two solve this problem we can do this
    requestLoan: {
      //We can use Prepare for multiple arguments
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return;
        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance += action.payload.amount;
      },
    },
    payLoan(state, action) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state, action) {
      state.isLoading = true;
    },
  },
});

export default accountSlice.reducer;

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

//This is Not RTX Way but it is easy to implement
export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };
  //Return the function i.e that redux will know about effects
  return async function (dispatch, getState) {
    // dispatch({ type: "account/convertingCurrency" });
    //API Call
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await res.json();
    const convertedCurrency = data.rates.USD;
    dispatch({ type: "account/deposit", payload: convertedCurrency });
    //dispatch Actions
  };
}
