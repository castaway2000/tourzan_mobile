import React, { PropTypes } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Colors } from '../constants'

var { width, height } = Dimensions.get('window');
class ApplyButton extends React.Component{
    render(){
        const {
            onPress,
            style,
        } = this.props;
        return(
          <TouchableOpacity style={style} onPress={ onPress} title={this.props.name}>
                <Text style={styles.button} >{this.props.name}</Text>
         </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button:{
        color:'white',
        paddingTop:13,
        textAlign:'center',
        fontSize: 18,
        height:50,
        width:width-60,
        overflow:'hidden',
        backgroundColor: Colors.main,
        borderRadius:5,
        borderColor: Colors.tintColor
    },
});

export default ApplyButton;