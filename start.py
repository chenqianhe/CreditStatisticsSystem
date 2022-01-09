from gevent.pywsgi import WSGIServer
# from gevent import monkey
from server.app import app

if __name__ == '__main__':
    print('Serving on 5000...')
    http_server = WSGIServer(('127.0.0.1', 5000), app)
    http_server.serve_forever()
