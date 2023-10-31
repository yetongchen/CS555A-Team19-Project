import sys
from bs4 import BeautifulSoup
import asyncio
import aiohttp
import json

pages = sys.argv[1]
date = sys.argv[2]
state = sys.argv[3]
city = sys.argv[4]

# pages = 10
# date = "2023-10-31"
# state = "NJ"
# city = "hoboken"


geo = f"{state}--{city.replace(' ', '-')}" if city else f'united-states--{state}'

base = f"https://www.eventbrite.com/d/{geo}/all-events/?end_date={date}&start_date={date}&"
urls = [f"{base}page={i}" for i in range(1, int(pages)+1)]


events = set()


async def fetch(session, url):
    async with session.get(url) as response:
        if response.status != 200:
            response.raise_for_status()
        soup = BeautifulSoup(await response.text(), 'html.parser')
        results = soup.find_all("a", {"class": "event-card-link"})
        for result in results:
            events.add(result['data-event-id'])


async def fetch_all(session, urls):
    tasks = []
    for url in urls:

        task = asyncio.create_task(fetch(session, url))
        tasks.append(task)
    results = await asyncio.gather(*tasks)
    return results


async def main():
    async with aiohttp.ClientSession() as session:
        await fetch_all(session, urls)


asyncio.run(main())

eventIDs = json.dumps(list(events))
sys.stdout.write(eventIDs)
