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
            title,
            onPress,
            style,
        } = this.props
        return(
             <View style={styles.container}>
                    <TouchableOpacity onPress={onPress}>
                        <Image  resizeMode='center' style={styles.backButton} source={require("../assets/images/back.png")} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>{title}</Text>
                    <Image style={styles.rightView} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        marginTop:10,
        width:width,
        height: 50,
        alignItems:'center',
        flex:1,
        flexDirection:'row',
        
    },
    backView:{
       height:50,
       width: 50,
    },
    backButton:{
        height:15,
        width:50,
    },
    centerText:{
        color:'#fff',
        textAlign:'center',
        fontSize:20,
        width:width-100,
    },
    rightView:{
        height:50,
        width:50
    }
});

export default NavigationBar;