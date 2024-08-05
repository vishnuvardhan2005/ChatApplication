from flask import Flask, request
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print('User connected:', request.sid)
    emit('user_connected', {'user_id': request.sid}, broadcast=True, include_self=False)

@socketio.on('disconnect')
def handle_disconnect():
    print('User disconnected:', request.sid)
    emit('user_disconnected', {'user_id': request.sid}, broadcast=True)

@socketio.on('message')
def handle_message(msg):
    user_id = request.sid
    print(f'Message from {user_id}: {msg}')
    emit('message', {'msg': msg, 'user_id': user_id}, broadcast=True, include_self=False)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
