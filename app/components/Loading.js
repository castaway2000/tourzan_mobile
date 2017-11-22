import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'

class PLoading extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style = {styles.container}>
                <Spinner visible = {this.props.visible}/>
            </View>  
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    }
})

export default PLoading;