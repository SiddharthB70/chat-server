import asyncio
import json

import websockets

clients = []
clientNames = []

async def handler(websocket):
    while True:
        try:
            message = await websocket.recv()
            msg = json.loads(message)
            if msg['type'] == "connection":
                if websocket not in clients:
                    clients.append(websocket)
                    clientNames.append(msg['name'])
                if len(clientNames) != 0:
                    convoClients = (", ".join(clientNames)) + " in conversation"
                    senderMessage = {"type": "senderJoined","value": convoClients}
                    await websocket.send(json.dumps(senderMessage))
            # else:
            # elif msg['type']=="connectionClosed":
            #     print(msg)
            #     clients.remove(websocket)
            #     clientNames.remove(msg['name'])

            broadClients = clients.copy()
            if websocket in broadClients:
                broadClients.remove(websocket)
            websockets.broadcast(broadClients,message)
        except websockets.ConnectionClosedOK or websockets.ConnectionClosedError:
            pos = clients.index(websocket)
            clients.remove(websocket)
            name = clientNames.pop(pos)
            m = {"type":"connectionClosed","name":name}
            websockets.broadcast(clients,json.dumps(m))
            break

async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())