import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react'
import { Colors, Sizes } from '../constants/styles';

const Calendar = ({ showCalender, changeDate }) => {

    const handleConfirm = (e, date) => {
        changeDate(date);
    };

    return (
        showCalender && <DateTimePicker
            value={new Date()}
            mode="date"
            onChange={handleConfirm}
            minimumDate={new Date()}
            accentColor={Colors.primaryColor}
            style={{ marginVertical: Sizes.fixPadding * 2.0 }}
        />
    )
}

export default Calendar