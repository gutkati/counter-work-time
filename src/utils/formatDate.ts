export const formatDate = (selectedDate: Date) => {
        if(!selectedDate) return
        let day = getDay(selectedDate);
        let month = getMonth(selectedDate)
        let year = selectedDate.getFullYear();
        return selectedDate ? `${day}.${month}.${year}` : ''
    }

    function getDay(selectedDate: Date) {
        if (!selectedDate) return
        let day = selectedDate.getDate()
        if (day < 10) {
            return `0${day}`
        } else {
            return day
        }
    }

    function getMonth(selectedDate: Date) {
        if (!selectedDate) return
        let month = selectedDate.getMonth() + 1
        if (month < 10) {
            return `0${month}`
        } else {
            return month
        }
    }