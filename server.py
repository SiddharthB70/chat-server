import asyncio
import json

import websockets

clients = []
clientNames = []

async def handler(websocket):
    async for message in websocket:
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
        broadClients = clients.copy()
        if websocket in broadClients:
            broadClients.remove(websocket)
        websockets.broadcast(broadClients,message)


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())