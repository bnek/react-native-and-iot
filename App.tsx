import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Text,
  Button,
  TextInput,
} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

class App extends Component<{}, { logs: string[]; message: string }> {
  constructor(props: any) {
    super(props);
    this.state = { logs: ['starting'], message: '' };
  }

  componentWillMount() {
    nodejs.start('main.js');
    nodejs.channel.addListener(
      'message',
      (msg) => this.log('from node-js: ' + msg),
      this,
    );
    this.log('done, waiting for messages from channel');
  }

  public render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View>
              {this.state.logs.map((s, i) => (
                <Text key={`log${i}`}>{s}</Text>
              ))}
            </View>
          </ScrollView>
          <View>
            <TextInput
              placeholder="Type message here!"
              onChangeText={(text: string) =>
                this.setState({ ...this.state, message: text })
              }
              value={this.state.message}
            />
            <Button
              title="send!"
              onPress={() =>
                nodejs.channel.send(this.state.message)
              }
            />
          </View>
        </SafeAreaView>
      </>
    );
  }

  private log(msg: string) {
    this.setState({ logs: [...this.state.logs, msg] });
  }
}
export default App;