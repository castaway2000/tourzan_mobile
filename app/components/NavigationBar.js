import React, { PropTypes } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';

var { width, height } = Dimensions.get('window');
class NavigationBar extends React.Component{
    render(){
        const {
            bgColor,
            title,
            onPress,
        } = this.props
        return(
             <View style={[styles.container,{backgroundColor:bgColor}]}>
                    <TouchableOpacity onPress={onPress}>
                        <Image  resizeMode='cover' style={styles.backButton} source={require("../assets/images/back.png")} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>{title}</Text>
                    <Image style={styles.rightView} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:width,
        paddingTop:20,
        height: 64,
        alignItems:'center',
        flexDirection:'row',
    },
    backView:{
       height:44,
       width: 50,
    },
    backButton:{
        marginLeft:20,
        height:15,
        width:10,
    },
    centerText:{
        color:'#fff',
        textAlign:'center',
        fontSize:17,
        width:width-100,
    },
    rightView:{
        height:44,
        width:50
    }
});

export default NavigationBar;