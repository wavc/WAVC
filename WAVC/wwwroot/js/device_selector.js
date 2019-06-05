function AddRadio(deviceList, device_name, input_name)
{
    if(deviceList.length>1)
	{
        var audioSelecter = document.getElementById(device_name + "_select");
        for(var i = 0 ; i < deviceList.length ; i++)
        {
            audioSelecter.innerHTML += '<input type="radio" value="'+ i +'" \
                name="'+device_name+'_devices" '+ (i==0 ? 'checked' : '') +'/> \
                '+device_name+' device ' + (i+1);				
        }
        audioSelecter.innerHTML += '<input type="radio" value="-1" name="'+device_name+'_devices"/> off';
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