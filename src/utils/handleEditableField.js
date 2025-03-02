export function showFieldLoading(target) {
    const parent = target.parentElement;
    let loading = parent.getElementsByTagName('img')[0];

    target.style.display = 'none';
    loading.style.display = 'initial';
}

export function hideFieldLoading(target, showTarget = true) {
    const parent = target.parentElement;
    let loading = parent.getElementsByTagName('img')[0];

    if (showTarget) target.style.display = 'initial';
    loading.style.display = 'none';
}