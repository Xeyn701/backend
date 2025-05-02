const mqtt = require('mqtt');

// Konfigurasi koneksi
const options = {
  host: 'c16dd490f9a74030963686fd3fcab6f7.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts', // Gunakan protokol MQTT with TLS
  username: 'rioprdn',
  password: 'Apaansih701',
  clientId: `nodejs_backend_${Math.random().toString(16).slice(2, 8)}`,
  connectTimeout: 5000, // Batas waktu koneksi dalam milidetik
  reconnectPeriod: 1000, // Periode percobaan koneksi ulang dalam milidetik
  rejectUnauthorized: true // Validasi sertifikat
};

// Membuat koneksi
console.log('Menghubungkan ke MQTT broker HiveMQ Cloud...');
const client = mqtt.connect(`mqtts://${options.host}:${options.port}`, options);

// Event handler
client.on('connect', () => {
  console.log('Terhubung ke HiveMQ Cloud!');
  
  // Subscribe ke topik-topik hydroponics
  const topics = [
    'hydroponics/sensors/+',
    'hydroponics/relays/+',  // Direct relay topics
    'hydroponics/relays/+/state',
    'hydroponics/relays/+/command',
    'hydroponics/relays/+/label',
    'hydroponics/schedules/+/state',
    'hydroponics/schedules/+/command',
    'hydroponics/system/+',
    'hydroponics/system/request_state'
  ];
  
  topics.forEach(topic => {
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Berhasil subscribe ke ${topic}`);
      } else {
        console.error(`Gagal subscribe ke ${topic}:`, err);
      }
    });
  });
  
  // Publish pesan status awal
  client.publish('hydroponics/system/status', JSON.stringify({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'Backend system connected'
  }));
  
  // Also publish relay information
  publishRelayInfo();
  
  // And publish schedule information
  publishScheduleInfo();
});

// Handle state requests
client.on('message', (topic, message) => {
  console.log(`Pesan diterima dari topik ${topic}: ${message.toString()}`);
  
  // Handle direct relay topics (hydroponics/relays/{id})
  if (topic.match(/^hydroponics\/relays\/\d+$/)) {
    const relayId = topic.split('/')[2];
    const value = message.toString();
    
    // Update relay state based on direct topic value
    updateRelayState(relayId, { value });
    
    return;
  }
  
  // Handle system request_state topic with better state synchronization
  if (topic === 'hydroponics/system/request_state') {
    try {
      const request = JSON.parse(message.toString());
      
      if (request.request === 'all') {
        // Publish all state information with retain flags
        publishRelayInfo(true);
        publishScheduleInfo(true);
        publishSensorHistory();
      } else if (request.request === 'relay') {
        publishRelayInfo(true);
      } else if (request.request === 'schedule') {
        publishScheduleInfo(true);
      } else if (request.request === 'sensor' && request.sensor) {
        publishSensorHistory(request.sensor);
      } else if (request.request === 'create_defaults') {
        // Create default topics if they don't exist
        createDefaultTopics();
      }
    } catch (e) {
      console.error('Error parsing request_state message:', e);
    }
  }
  
  // Handle relay commands
  if (topic.match(/hydroponics\/relays\/\d+\/command/)) {
    // Process relay command and update state
    const relayId = topic.split('/')[2];
    try {
      const command = JSON.parse(message.toString());
      updateRelayState(relayId, command);
    } catch (e) {
      console.error(`Error processing relay command for ${relayId}:`, e);
    }
  }
  
  // Handle relay label updates
  if (topic.match(/hydroponics\/relays\/\d+\/label/)) {
    const relayId = topic.split('/')[2];
    try {
      const labelData = JSON.parse(message.toString());
      updateRelayLabel(relayId, labelData.description);
    } catch (e) {
      console.error(`Error processing relay label update for ${relayId}:`, e);
    }
  }
  
  // Handle schedule commands
  if (topic.match(/hydroponics\/schedules\/\d+\/command/)) {
    const relayId = topic.split('/')[2];
    try {
      const scheduleData = JSON.parse(message.toString());
      updateSchedule(relayId, scheduleData);
    } catch (e) {
      console.error(`Error processing schedule update for ${relayId}:`, e);
    }
  }
});

// Function to update relay state with retain flag
function updateRelayState(relayId, command) {
  // In a real app, this would update a database
  console.log(`Updating relay ${relayId} to ${command.value}`);
  
  // Publish to direct topic with retain flag
  client.publish(`hydroponics/relays/${relayId}`, command.value, { retain: true });
  
  // Publish the new state to individual state topic with retain flag
  client.publish(`hydroponics/relays/${relayId}/state`, JSON.stringify({
    value: command.value,
    timestamp: new Date().toISOString()
  }), { retain: true });
  
  // Also update the relay info with retain flag
  publishRelayInfo(true); // Pass true to use retain flag
}

// Function to publish relay information with retain option
function publishRelayInfo(useRetain = false) {
  // Get latest relay states
  const relayStates = {};
  
  // This would normally come from a database
  const relays = [
    { id: '1', description: 'Pump 1', value: 'off' },
    { id: '2', description: 'Light', value: 'on' },
    { id: '3', description: 'Fan', value: 'off' },
    { id: '4', description: 'Heating', value: 'off' }
  ];
  
  // Publish all relay info to a single topic with retain option
  const publishOptions = useRetain ? { retain: true } : {};
  client.publish('hydroponics/relays/info', JSON.stringify(relays), publishOptions);
  
  // Also publish individual relay states with retain flag
  relays.forEach(relay => {
    client.publish(`hydroponics/relays/${relay.id}`, relay.value, { retain: true });
    client.publish(`hydroponics/relays/${relay.id}/state`, JSON.stringify({
      value: relay.value,
      timestamp: new Date().toISOString()
    }), { retain: true });
  });
}

// Function to publish schedule information
function publishScheduleInfo(useRetain = false) {
  // This would normally come from a database
  const schedules = [
    { id: '1', relayId: '1', enabled: true, startTime: '08:00', endTime: '18:00' },
    { id: '2', relayId: '2', enabled: true, startTime: '06:00', endTime: '20:00' },
    { id: '3', relayId: '3', enabled: false, startTime: '12:00', endTime: '14:00' },
    { id: '4', relayId: '4', enabled: false, startTime: '22:00', endTime: '06:00' }
  ];
  
  // Publish all schedules to a single topic
  const publishOptions = useRetain ? { retain: true } : {};
  client.publish('hydroponics/schedules/all', JSON.stringify(schedules), publishOptions);
  
  // Also publish individual schedule states
  schedules.forEach(schedule => {
    client.publish(`hydroponics/schedules/${schedule.relayId}/state`, JSON.stringify({
      ...schedule,
      timestamp: new Date().toISOString()
    }), { retain: true });
  });
}

// Function to publish sensor history
function publishSensorHistory(sensorType = null) {
  // Log the request but don't create any fake data
  console.log(`Received request for ${sensorType ? sensorType : 'all sensor'} history. Hardware will send real data.`);
  
  // We don't need to do anything here as hardware will publish real data
}

// Function to update relay label
function updateRelayLabel(relayId, description) {
  // In a real app, this would update a database
  console.log(`Updating relay ${relayId} label to "${description}"`);
  
  // Publish updated relay info
  publishRelayInfo();
}

// Function to update schedule
function updateSchedule(relayId, scheduleData) {
  // In a real app, this would update a database
  console.log(`Updating schedule for relay ${relayId}:`, scheduleData);
  
  // Publish the updated schedule
  client.publish(`hydroponics/schedules/${relayId}/state`, JSON.stringify({
    ...scheduleData,
    relayId,
    timestamp: new Date().toISOString()
  }), { retain: true });
  
  // Also update all schedules
  publishScheduleInfo();
}

// Function to create default topics if they don't exist
function createDefaultTopics() {
  // Create default relay info
  publishRelayInfo(true);
  
  // Create default schedule info
  publishScheduleInfo(true);
  
  // No need to create default sensor data - hardware will send real data
  
  // Publish system status
  client.publish('hydroponics/system/status', JSON.stringify({
    status: 'default_data_created',
    timestamp: new Date().toISOString(),
    message: 'Default control structure created, waiting for hardware sensor readings'
  }));
}

client.on('error', (err) => {
  console.error('Terjadi kesalahan:', err);
});

client.on('close', () => {
  console.log('Koneksi tertutup');
});

// Handler untuk menutup koneksi saat aplikasi dihentikan
process.on('SIGINT', () => {
  console.log('Menutup koneksi MQTT...');
  client.end(true, () => {
    console.log('Koneksi MQTT ditutup');
    process.exit(0);
  });
});

// Ekspor client MQTT untuk digunakan di bagian lain aplikasi
module.exports = client;
