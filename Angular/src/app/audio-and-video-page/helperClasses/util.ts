export class Util {
    static WaitForObject(object, Condition, Handler) {
        if (Condition(object)) {
            setTimeout(() => { Util.WaitForObject(object, Condition, Handler); }, 200);
        } else {
            Handler(object);
        }
    }
    static DeleteElement(elementName) {
        try {
            const videoToDelete = document.getElementById(elementName);
            videoToDelete.parentElement.removeChild(videoToDelete);
        } catch {
        }
    }
    static AddRadio(deviceList, deviceName, checkCondt) {
        if (deviceList.length > 0) {
            const deviceSelecter = document.getElementById(deviceName + '_select');
            deviceSelecter.innerHTML += '<h6>' + deviceName + ' devices </h6>';
            for (let i = 0; i < deviceList.length; i++) {
                deviceSelecter.innerHTML += '<input type="radio" value="' + i + '" \
                    name="' + deviceName + '_devices" ' + (checkCondt(i) ? 'checked' : '') + '/> \
                    device ' + (i + 1) + ' (' + deviceList[i][1] + ')<br/>';
            }
            deviceSelecter.innerHTML += '<input type="radio" value="-1" name="' + deviceName + '_devices" \
                ' + (checkCondt(deviceList.length) ? 'checked' : '') + '/> off';
        }
    }
    static GetSelectedRadio(radioName) {
        const radios = document.getElementsByName(radioName) as NodeListOf<HTMLInputElement>;
        for (let i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
        return null;
    }
    static GetSelectedRadioElement(radioName, value) {
        const radios = document.getElementsByName(radioName) as NodeListOf<HTMLInputElement>;
        for (let i = 0, length = radios.length; i < length; i++) {
            if (radios[i].value === value) {
                return radios[i];
            }
        }
        return null;
    }
}
