import asyncio
import websockets
import json

clients = []

async def handler(websocket):
    async for message in websocket:
        message = json.loads(message)
        if message['type'] == "connection":
            if websocket not in clients:
                clients.append(websocket)
        else:
            broadClients = clients.copy()
            if websocket in broadClients:
                broadClients.remove(websocket)
            websockets.broadcast(broadClients,message['value'])


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())