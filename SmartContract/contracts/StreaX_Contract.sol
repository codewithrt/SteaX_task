// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract StreaX_Contract{
       
       using SafeMath for uint256;
       string public name = "StreaX Token";
       string public symbol = "StreaX";
       uint256 public decimals = 18;
       uint256 public totalSupply;
       address public Owner;

       mapping(address=>uint256) public balanceOf;
       mapping(address => mapping(address => uint256)) public allowance;

       event Transfer(address from , address to , uint256 value); 
       event Approval(address owner, address spender, uint256 value);

    //    Taking initial supply to be 100*(10**18)
    // and setting all tokens to owner
       constructor(){
          totalSupply = 100*(10**decimals);
          balanceOf[msg.sender] = totalSupply;
          Owner = msg.sender;
       }

       modifier OnlyOwner{
         require(msg.sender == Owner);
          _;
       }

       function _transfer(address _from ,address _to , uint256 _value) internal{
        require(_to != _from);
         balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(msg.sender, _to, _value); 
    }

       function TransferTokens(address _to,uint256 _value) public returns(bool){
         require(balanceOf[msg.sender] >= _value);
         _transfer(msg.sender, _to, _value);
          return true;
       }
        
        function approve(address _spender,uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
     }

        function TransferFromToken(address _from , address _to ,uint256 _value) public returns(bool success){
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
       _transfer(_from, _to, _value);
       return true;
    }
    
     function CreateTokens(uint256 _Value) public  OnlyOwner{
        totalSupply = totalSupply.add(_Value);
        // Balance goes to owner
        balanceOf[msg.sender] = balanceOf[msg.sender].add(_Value);
     }
}
