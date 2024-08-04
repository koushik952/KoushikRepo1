public class AccountTriggerKeepTeamHandler {

@future
public static void retainOldTeamMemberOnOwnerChange(String str){
	system.debug('Future call '+str); 
	List<AccountTeamMember> newlistAcc = (List<AccountTeamMember>) JSON.deserialize(str,List<AccountTeamMember>.class);
	for(AccountTeamMember objAccTeamMember : newlistAcc){
		objAccTeamMember.Id= null;
	}
	system.debug('Account records to insert'+(JSON.serialize(newlistAcc)));
	Upsert newlistAcc;
}
}