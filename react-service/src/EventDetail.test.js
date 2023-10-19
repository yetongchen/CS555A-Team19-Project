import renderer, { act } from 'react-test-renderer';
import axios from 'axios';

jest.mock('axios');

let EventDetail;

const mockEvent = {
  logo: {
    url: 'test-url'
  },
  name: {
    text: 'Test Event'
  },
  start: {
    local: new Date().toISOString(),
    timezone: 'UTC'
  },
  end: {
    local: new Date().toISOString()
  },
  venue: {
    name: 'Test Venue',
    address: {
      address_1: 'Test Address'
    }
  },
  description: {
    text: 'Description line 1\nDescription line 2\nDescription line 3\nDescription line 4'
  },
  external_ticketing: {
    external_url: 'test-link'
  }
};

describe('<EventDetail /> unit tests', () => {
  
  beforeEach(() => {
    EventDetail = require('./components/EventDetail').default;
    axios.get.mockResolvedValue({ data: mockEvent });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays the event name correctly', async () => {
    let component;
    try {
      await act(async () => {
        component = renderer.create(<EventDetail />);
      });
    } catch (error) {
      console.error('Rendering error:', error);
      throw error;
    }

    const instance = component.root;
    const eventName = instance.findByProps({ className: "event-name" }).children[0];
    expect(eventName).toEqual(mockEvent.name.text);
  });

  it('renders the event venue correctly', async () => {
    let component;
    try {
      await act(async () => {
        component = renderer.create(<EventDetail />);
      });
    } catch (error) {
      console.error('Rendering error:', error);
      throw error;
    }

    const instance = component.root;
    const eventAddress = instance.findByProps({ className: "event-address" }).children;
    expect(eventAddress[1]).toEqual(mockEvent.venue.name);
  });

});
