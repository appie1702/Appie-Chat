export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};


export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1]: users[0];
};


export const showAvatar = (messages,m,i,userID) => {
    return (
        //to show the avatar icon in front of specific message only
        i<messages.length-1 &&
        (messages[i+1].sender._id !== m.sender._id ||
            messages[i+1].sender._id === undefined) &&
            messages[i].sender._id !== userID
    );
};


export const isLastMessage = (messages,i,userID) => {
    return (
        //to show the avatar icon in front of last message
        i===messages.length-1 &&
        messages[messages.length-1].sender._id !== userID &&
            messages[messages.length-1].sender._id
    );
};


export const SameSenderMargin = (messages,m,i,userID)=>{
    if(
        i<messages.length-1 && 
        messages[i+1].sender._id === m.sender._id &&
        messages[i].sender._id !== userID
    )
        return 33;
        else if (

            (i<messages.length-1 && 
            messages[i+1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userID
        ) || (
                i === messages.length-1 && messages[i].sender._id !== userID
            )
        )
            return 0;
        
        else return"auto";
}

export const isSameUser = (messages,m,i) => {
    return i>0 && messages[i-1].sender._id === m.sender._id;
}