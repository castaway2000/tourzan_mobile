import React, { PropTypes } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';

var { width, height } = Dimensions.get('window');
class ApplyButton extends React.Component{
    render(){
        const {
            onPress,
            style,
        } = this.props
        return(
          <TouchableOpacity style={style} onPress={ onPress} title={this.props.name}>
                <Text style={styles.button} >{this.props.name}</Text>
         </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button:{
        color:'#fff',
        paddingTop:13,
        textAlign:'center',
        fontSize: 18,
        height:50,
        width:width-60,
        overflow:'hidden',
        backgroundColor:'#31dd73',
        borderRadius:5,
        borderColor: '#555555'
    },
});

export default ApplyButton;