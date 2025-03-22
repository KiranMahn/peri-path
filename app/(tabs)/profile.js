import React from 'react';
// import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import TableRow from '../widgets/TableRow';
import { View, Text, Button, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);

    useEffect(() => {
        let thisuser = JSON.parse(localStorage.getItem("user")) || '';
        let username = thisuser.username;

        let users = JSON.parse(localStorage.getItem("users")) || [];
        let userIndex = users.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            setUser(users[userIndex]);
            console.log("User information retrieved");
        } else {
            console.log("User not found");
        }
    }, []);

    const handleSignout = () => {
        navigate('/login');
    };

    return (

        // <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        //     <View style={{ display: 'flex', flexDirection: 'column'}}>
                // {/* <TouchableOpacity style={{top: 5, left: 5, width: '5em', position: 'absolute'}} onClick={() => navigate('/home')}>back</TouchableOpacity> */}
        //         <View style={{flex: 0.5, top: 0, width: '100%', display: 'flex', justifyContent: 'space-around', flexDirection: 'column', backgroundColor: '#009688'}}>
        //             <View style={{display: 'flex', width: '100%', justifyContent: 'end'}}>
        //                 <TouchableOpacity onClick={() => navigate('/profile')} style={{ border: '1px white solid', marginRight: '1em', marginTop: '1em' }}>Profile</TouchableOpacity>
        //             </View>
        //             <h1 style={{color: 'white'}}>Calendar</h1>
        //         </View>
                // <View style={{display: 'flex', flexDirection: 'column', width: '50vw'}}>
                   
                //     <TableRow field={"Username"} value={user.username}/>
                //     <TableRow field={"Name"} value={user.name}/>
                //     <TableRow field={"email"} value={user.email}/>
                //     <TableRow field={"password"} value={user.password}/>
                //     <TableRow field={"Gender"} value={user.gender}/>
                //     <TableRow field={"Age"} value={user.age}/>
                // </View>
                

                // <TouchableOpacity style={{marginTop: '2em'}} onClick={handleSignout}>Sign Out</TouchableOpacity>
                
                // <View style={{bottom: 0, display: 'flex', flexDirection: 'row'}}>
                //     <TouchableOpacity >Delete Account</TouchableOpacity>
                //     <TouchableOpacity >Request my data</TouchableOpacity>
                // </View>
        //     </View>
            
        // </View>

        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <View style={{flex: 0.5, top: 0, width: '100%', display: 'flex', justifyContent: 'space-around', flexDirection: 'column', backgroundColor: '#009688'}}>
                
                <View style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                    <TouchableOpacity style={{border: '1px white solid', marginRight: '1em', marginTop: '1em'}} onClick={() => navigate('/home')}>Back</TouchableOpacity> 
                    <TouchableOpacity style={{ border: '1px white solid', marginRight: '1em', marginTop: '1em' }}>Edit</TouchableOpacity>

                </View>
                <Text style={{color: 'white'}}>Profile</Text>
            </View>


            <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '1em'}}>
                <View style={{display: 'flex', flexDirection: 'column', width: '70vw'}}>
                    <TableRow field={"Username"} value={user.username}/>
                    <TableRow field={"Name"} value={user.name}/>
                    <TableRow field={"Email"} value={user.email}/>
                    <TableRow field={"Password"} value={user.password}/>
                    <TableRow field={"Gender"} value={user.gender}/>
                    <TableRow field={"Age"} value={user.age}/>
                </View>
                
            </View>

            <View style={{flex: 1}}>
                <TouchableOpacity style={{marginTop: '2em'}} onClick={handleSignout}>Sign Out</TouchableOpacity>
            </View>
                
            <View style={{bottom: 0, display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity >Delete Account</TouchableOpacity>
                <TouchableOpacity >Request my data</TouchableOpacity>
            </View>
        </View>                          
        
        
    );
};

export default Profile;