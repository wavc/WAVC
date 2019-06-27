function AddRadio(deviceList, device_name, CheckCondt)
{
    if(deviceList.length>1)
    {
        var deviceSelecter = document.getElementById(device_name + "_select");
        deviceSelecter.innerHTML += "<h6>" + device_name + " devices </h6>";
        for(var i = 0 ; i < deviceList.length ; i++)
        {
            deviceSelecter.innerHTML += '<input type="radio" value="'+ i +'" \
                name="'+device_name+'_devices" '+ (CheckCondt(i) ? 'checked' : '') +'/> \
                device ' + (i+1) + ' (' + deviceList[i][1] + ')<br/>';				
        }
        deviceSelecter.innerHTML += '<input type="radio" value="-1" name="' + device_name + '_devices" \
            ' + (CheckCondt(deviceList.length) ? 'checked' : '') + '/> off';
	}
}
function GetSelectedRadio(radio_name)
{
    var radios = document.getElementsByName(radio_name);
    for (var i = 0, length = radios.length; i < length; i++)
	{
		if (radios[i].checked)
		{
			return radios[i].value;
		}
    }
    return null;
}