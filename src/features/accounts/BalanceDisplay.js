// import { useSelector } from "react-redux";
import { connect } from "react-redux";

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
//Before REact Hooks connect api was used
function BalanceDisplay({ balance }) {
  // const account = useSelector((store) => store.account);
  // return <div className="balance">{formatCurrency(account.balance)}</div>;
  return <div className="balance">{formatCurrency(balance)}</div>;
}

function mapStateToProps(state) {
  return {
    balance: state.account.balance,
  };
}
export default connect(mapStateToProps)(BalanceDisplay);
