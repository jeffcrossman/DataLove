import json
import collections
import math



# is both at home
# Top-Left:  40.456218, -79.941054
# Bottom-Right: 40.453867, -79.934284 (y, x)

GeoCoordinate = collections.namedtuple('GeoCoordinate', 'lat, lon')


boyfile = 'openpaths_jeff.json'
girlfile = 'openpaths_ramya.json'

bjson_data=open(boyfile).read()
boydata = json.loads(bjson_data)

gjson_data=open(girlfile).read()
girldata = json.loads(gjson_data)

outfile = open('distances.json', 'w')

boydataindex = 0
boydatacount = len(boydata)
girldataindex = 0
girldatacount = len(girldata)

# Set begining time
currenttime = 1390617600



def getboylocation(timestamp):
	global boydataindex
	global boydata
	while boydataindex < boydatacount and timestamp > boydata[boydataindex]['t']:
		boydataindex += 1

	if boydataindex == boydatacount:
		return None
	elif boydata[boydataindex]['t'] == timestamp:
		return GeoCoordinate(boydata[boydataindex]['lat'], boydata[boydataindex]['lon'])
	elif boydataindex > 0:
		# Interpolate
		ilat = ( ( timestamp - boydata[boydataindex-1]['t'] ) * ( boydata[boydataindex]['lat'] - boydata[boydataindex-1]['lat']) / ( boydata[boydataindex]['t'] - boydata[boydataindex-1]['t']) ) + boydata[boydataindex-1]['lat']
		ilon = ( ( timestamp - boydata[boydataindex-1]['t'] ) * ( boydata[boydataindex]['lon'] - boydata[boydataindex-1]['lon']) / ( boydata[boydataindex]['t'] - boydata[boydataindex-1]['t']) ) + boydata[boydataindex-1]['lon']
		return GeoCoordinate(ilat, ilon)
	else:
		return None
  		


def getgirllocation(timestamp):
	global girldataindex
	global girldata
	while girldataindex < girldatacount and timestamp > girldata[girldataindex]['t']:
		girldataindex += 1

	if girldataindex == girldatacount:
		return None
	elif girldata[girldataindex]['t'] == timestamp:
		return GeoCoordinate(girldata[girldataindex]['lat'], girldata[girldataindex]['lon'])
	elif girldataindex > 0:
  		# Interpolate
		ilat = ( ( timestamp - girldata[girldataindex-1]['t'] ) * ( girldata[girldataindex]['lat'] - girldata[girldataindex-1]['lat']) / ( girldata[girldataindex]['t'] - girldata[girldataindex-1]['t']) ) + girldata[girldataindex-1]['lat']
		ilon = ( ( timestamp - girldata[girldataindex-1]['t'] ) * ( girldata[girldataindex]['lon'] - girldata[girldataindex-1]['lon']) / ( girldata[girldataindex]['t'] - girldata[girldataindex-1]['t']) ) + girldata[girldataindex-1]['lon']
		return GeoCoordinate(ilat, ilon)
	else:
		return None



def calculatedistance(geo1, geo2):
	# haversine formula
	R = 6371 # km
	dLat = math.radians(geo2.lat-geo1.lat)
	dLon = math.radians(geo2.lon-geo1.lon)
	lat1 = math.radians(geo1.lat)
	lat2 = math.radians(geo2.lat)

	a = math.sin(dLat/2) * math.sin(dLat/2) + math.sin(dLon/2) * math.sin(dLon/2) * math.cos(lat1) * math.cos(lat2)
	c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
	d = R * c
	print d
	return d # km



outfile.write('[')

# Look through 30 minute intervals
counter = 0
while currenttime < 1393088768:
	# Find data point in both sets
	boyloc = getboylocation(currenttime)
	girlloc = getgirllocation(currenttime)

	if boyloc != None and girlloc != None:
		if counter > 0:
			outfile.write(',')
		distance = calculatedistance(boyloc, girlloc)
		outfile.write('{"time": ' + str(currenttime) + ', "distance": ' + str(distance) + '}')
		counter += 1

	currenttime += 1800


print counter
outfile.write(']')
outfile.close()
# Calculate distance in meters







