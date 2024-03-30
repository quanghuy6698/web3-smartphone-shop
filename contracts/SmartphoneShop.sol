pragma solidity >=0.4.22 <0.9.0;

contract SmartphoneShop {
    struct Transaction {
        string smartphone_id;
        uint smartphone_price;
        address user;
        string trans_type;
        string trans_time;
    }

    Transaction[] public transactionList;
    event LogNewAlert(string description);

    function executeTransaction(string calldata _id, uint _price, string calldata _transType, string calldata _transTime) external payable {
        require(msg.value >= _price, "Not enough ETH");

        transactionList.push(
        Transaction({
                smartphone_id: _id,
                smartphone_price: _price,
                user: msg.sender,
                trans_type: _transType,
                trans_time: _transTime
            })
        );
        emit LogNewAlert('Buy a smartphone.');
    }

    function getTransactionLen() public view returns (uint){
        uint len = transactionList.length;
        return len;
    }

}