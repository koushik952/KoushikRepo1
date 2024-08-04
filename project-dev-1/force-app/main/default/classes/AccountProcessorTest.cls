@isTest
public class AccountProcessorTest{

public static testMethod void testBatch(){
    Account acc = new Account();
    acc.Name = 'My Test Account';
    insert acc;
    
    Contact con = new Contact();
    con.LastName = 'Test Contact';
    con.AccountId = acc.id;
    
    Set<Id> AcctIds = new Set<Id>();
    AcctIds.add(acc.id);
    
    Test.StartTest();
    AccountProcessor.countContacts(AcctIds);
    Test.StopTest();
    }
   
}